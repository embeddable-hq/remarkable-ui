# 
# NOTE: 
#  Embeddable ignores this file.  
#  Changing this file *only* affects your local cube:playground environment
# 

from cube import TemplateContext
 
template = TemplateContext()

class SafeString(str):
	def __init__(self, value):
		super().__init__()
		self.is_safe = True

@template.function('list')
def list(values):
	if not values:
		return SafeString('(NULL)')
	string_values = map(str, values)
	formatted_values = ", ".join([f"'{value}'" if value.replace('.', '', 1).isdigit() == False else value for value in string_values])
	return SafeString(f"({formatted_values})")
